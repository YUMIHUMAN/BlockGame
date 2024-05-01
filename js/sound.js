`use strict`;

export class Sound{
    #data = null;

    constructor(src,volume=0.5, loop = false){
        this.#data = new Audio(src);
        //音源を設定する
        this.#data.volume = volume;
        //ループ再生を設定する
        this.#data.loop = loop;
    }

    play(){
        this.#data.play();
    }
}