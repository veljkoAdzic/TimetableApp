const transparentBorder = '#00000001';

export const EventColors = [
    { //yellow
        background: '#e6c232',
        border: transparentBorder,
        text: 'black'
    },

    { //blue
        background: '#4b6dd1',// '#4976de',
        border: transparentBorder,
        text: 'white'
    },

    { //green
        background: '#61d45d',//'#47c443',
        border: transparentBorder,
        text: 'black'
    },

    { //red
        background: '#db4644',
        border: transparentBorder,
        text: 'black'
    },

    { //light blue
        background: '#64a6d1',
        border: transparentBorder,
        text: 'balck'
    },

    { //orange
        background: '#e68332',
        border: transparentBorder,
        text: 'balck'
    },

    { //light green
        background: '#8fcf65',
        border: transparentBorder,
        text: 'black'
    },

    { // purple
        background: '#6548c7',
        border: transparentBorder,
        text: 'white'
    },
    { // pink
        background: '#e85d9b',
        border: transparentBorder,
        text: 'black'
    }
]

export interface EventColorsType {
    background: string,
    border: string,
    text: string
}