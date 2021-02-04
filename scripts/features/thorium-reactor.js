let calculate, effect, sync, explode;

calculate = () => {
    let blocks = new Seq();
    for(let y = -40; y <= 40; y++){
        for(let x = -40; x <= 40; x++){
            let res = x * x + y * y;
            
            if(res < 40 * 40){
                blocks.add(Seq.with(x, y));
            }
        };
    };
    return blocks;
};

effect = (reactor) => {
    let i = 0;
    Timer.schedule(() => {
        Call.createBullet(Bullets.slagShot, reactor.team, reactor.x, reactor.y, i, 0, 1, 8);
        i += 15;
    }, 0, 0, 24);
};

let timer;
sync = () => {
    if(timer) timer.cancel();
    timer = Timer.schedule(() => {
        Groups.player.each(e => {
            Call.worldDataBegin(e.con);
            Vars.netServer.sendWorldData(e);
        });
    }, 2);
};

explode = (rx, ry, rseq) => {
    Timer.schedule(() => {
        let nx = rx / Vars.tilesize;
        let ny = ry / Vars.tilesize;
        
        rseq.each(e => {
            let ux = nx + e.get(0);
            let uy = ny + e.get(1);
            
            if(ux > 0 && uy > 0 && ux < Vars.world.width() && uy < Vars.world.height()){
                if(Vars.world.tile(ux, uy).block !== Blocks.air){
                    if(Vars.world.tile(ux, uy).team() === Team.derelict){
                        Vars.world.tile(ux, uy).setAir();
                    };
                };
            };
        });
            
        sync();
    }, 4);
};

let radius = calculate();

Blocks.thoriumReactor.buildType = () => extend(NuclearReactor.NuclearReactorBuild, Blocks.thoriumReactor, {
    updateTile(){
        let cliquid = this.block.consumes.get(ConsumeType.liquid);
        let item = this.block.consumes.getItem().items[0].item;
        
        let fuel = this.items.get(item);
        let fullness = fuel / this.block.itemCapacity;
        this.productionEfficiency = fullness;
        
        if(fuel > 0 && this.enabled){
            this.heat += fullness * this.block.heating * Math.min(this.delta(), 4);
            
            if(this.timer.get(this.block.timerFuel, this.block.itemDuration / this.timeScale)){
                this.consume();
            }
        }else{
            this.productionEfficiency = 0;
        }
        
        let liquid = cliquid.liquid;
        
        if(this.heat > 0){
            let maxUsed = Math.min(this.liquids.get(liquid), this.heat / this.block.coolantPower);
            this.heat -= maxUsed * this.block.coolantPower;
            this.liquids.remove(liquid, maxUsed);
        }
        
        if(this.heat > this.smokeThreshold){
            let smoke = 1.0 + (heat - smokeThreshold) / (1 - smokeThreshold); //ranges from 1.0 to 2.0
            if(Mathf.chance(smoke / 20.0 * delta())){
                Fx.reactorsmoke.at(x + Mathf.range(size * tilesize / 2),
                y + Mathf.range(size * tilesize / 2));
            }
        }
        
        this.heat = Mathf.clamp(this.heat);
        
        if(this.heat >= 0.999){
            Events.fire(Trigger.thoriumReactorOverheat);
            effect(this);
            explode(this.x, this.y, radius);
            this.kill();
        }
    }
});
