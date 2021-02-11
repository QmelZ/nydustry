let give;

give = (mixer) => {
    if(mixer.liquids.get(Liquids.water) < 1){
        mixer.liquids.add(Liquids.water, Infinity);
    }
};

Blocks.cryofluidMixer.sync = true;
Blocks.cryofluidMixer.buildType = () => extend(LiquidConverter.LiquidConverterBuild, Blocks.cryofluidMixer, {
    updateTile(){
        this.super$updateTile();
        give(this);
    }
});
