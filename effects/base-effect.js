export var EffectDependency;
(function (EffectDependency) {
    EffectDependency[EffectDependency["NONE"] = 0] = "NONE";
    EffectDependency[EffectDependency["DEPTH"] = 2] = "DEPTH";
    EffectDependency[EffectDependency["LINEAR"] = 4] = "LINEAR";
})(EffectDependency || (EffectDependency = {}));
export default class BaseEffect {
    constructor() {
        this.post = null;
        this._flags = 0;
    }
    _init(post) {
        if (this.post !== post) {
            this.post = post;
            this.init();
        }
    }
}
