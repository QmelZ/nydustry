let give, explode;

give = (mixer) => {
    if(mixer.items.get(Items.lead) ==== 0)
        mixer.items.add(Items.lead, 100);
    }
};

explode = (mixer) => {
    mixer.proximity.each(b => {
        if(b !== null && b.block === Blocks.unloader && (b.sortItem === Items.lead || b.sortItem === null)){
            mixer.kill();
        }
    });
};

Blocks.pyratiteMixer.buildType = () => extend(GenericSmelter.SmelterBuild, Blocks.pyratiteMixer, {
    updateTile(){
        this.super$updateTile();
        give(this);
        explode(this);
    }
});
