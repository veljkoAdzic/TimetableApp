const transparentBorder = '#00000001';

export const EventColors = [
    { //yellow
        background: '#ebd82d',
        border: transparentBorder,
        text: 'black'
    },

    { //blue
        background: '#4976de',
        border: transparentBorder,
        text: 'white'
    },

    { //green
        background: '#47c443',
        border: transparentBorder,
        text: 'black'
    },

    { //red
        background: '#db4644',
        border: transparentBorder,
        text: 'black'
    }
]

export interface EventColorsType {
    background: string,
    border: string,
    text: string
}