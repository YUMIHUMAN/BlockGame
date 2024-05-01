`use strict`;
import { BlocksGame } from "./blocks.js";

const game = new BlocksGame(`canvas`);

document.addEventListener(`keydown`,(event) =>{
    game.setkeydownKey(event.key);
});

document.addEventListener(`keyup`, (event) => {
    game.setkeyupKey(event.key);
});