let give, produce, timer;

give = (sep) => {
    if(sep.liquids.get(Liquids.slag) < 1){
        sep.liquids.add(Liquids.slag, Infinity);
    }
};

produce = (sep) => {
    if(Mathf.equal(sep.warmup, 0, 0.001) && sep.items.total() > 0 && sep.timer.get(timer, 60)){
        while(sep.items.get(Items.graphite) >= 2){
            sep.items.remove(Items.graphite, 2);
            sep.items.add(Items.titanium, 1);
        }
        while(sep.items.get(Items.lead) >= 2){
            sep.items.remove(Items.lead, 2);
            sep.items.add(Items.graphite, 1);
        }
        while(sep.items.get(Items.copper) >= 2){
            sep.items.remove(Items.copper, 2);
            sep.items.add(Items.lead, 1);
        }
    }
};

Blocks.separator.sync = true;
timer = Blocks.separator.timers++;
Blocks.separator.buildType = () => extend(Separator.SeparatorBuild, Blocks.separator, {
    updateTile(){
        this.super$updateTile();
        give(this);
        produce(this);
    }
});
