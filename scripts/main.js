if(!Vars.headless){
    // die, this is a plugin and it wont work on not headless stuff
    Core.settings.put("mod-" + this.modName + "-enabled", false);
    Core.app.post(() => {throw "This is a plugin and it shouldn't be used on clients"});
}else{
    let features = Seq.with(
        "thorium-reactor"
    );
    
    features.each(e => {
        require("features/" + e);
    });
};
