import { animate, group,  state, style, transition, trigger, query } from '@angular/animations';


export const ToolbarAnimation = [

    trigger('toggle', [

        state('on', style(
            { 'opacity': '1' }
        )),
        state('off', style(
            { 'opacity': '0' }
        )),

        transition('void => *', [
            style(
                { 'opacity': '1' }
            ),
            animate('1000ms ease-in')
        ]),

        transition('* => void', [
            style(
                { 'opacity': '0' }
            ),
            animate('1000ms')
        ])

    ])

];