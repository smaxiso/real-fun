export interface Riddle {
    id: string;
    question: string;
    answer: string;
    options: string[];
}

const existingRiddles: Riddle[] = [
    {
        id: '1',
        question: 'FUNERAL',
        answer: 'REAL FUN',
        options: [
            'REAL FUN',
            'FEAR RUN',
            'FAR RUNE',
            'EARL FUN'
        ]
    },
    {
        id: '2',
        question: 'TOM MARVOLO RIDDLE',
        answer: 'I AM LORD VOLDEMORT',
        options: [
            'I AM LORD VOLDEMORT',
            'MR TOM A DROLL LOVE',
            'IMMORTAL LOVE ROD',
            'OLD MAD ROMEO LIVER'
        ]
    }
];

const newRiddles: Riddle[] = [
    {
        id: '3',
        question: 'THE EYES',
        answer: 'THEY SEE',
        options: ['THEY SEE', 'SHE EYE', 'THE YES', 'SEE THY']
    },
    {
        id: '4',
        question: 'ASTRONOMER',
        answer: 'MOON STARER',
        options: ['MOON STARER', 'STAR MORN', 'ROME RANTS', 'NO MORE STAR']
    },
    {
        id: '5',
        question: 'DORMITORY',
        answer: 'DIRTY ROOM',
        options: ['DIRTY ROOM', 'DO MIRROR', 'DRY MOTOR', 'DIM ROOF']
    },
    {
        id: '6',
        question: 'THE CLASSROOM',
        answer: 'SCHOOL MASTER',
        options: ['SCHOOL MASTER', 'COOL HAMSTER', 'SMART SCHOOL', 'THE MARS COOL']
    },
    {
        id: '7',
        question: 'A GENTLEMAN',
        answer: 'ELEGANT MAN',
        options: ['ELEGANT MAN', 'MAN GENT LE', 'TAME ANGEL', 'GENTLE NAME']
    },
    {
        id: '8',
        question: 'ELEVEN PLUS TWO',
        answer: 'TWELVE PLUS ONE',
        options: ['TWELVE PLUS ONE', 'ONE PLUS TWELVE', 'TWO PLUS ELEVEN', 'ELEVEN TWO PLUS']
    },
    {
        id: '9',
        question: 'THE MORSE CODE',
        answer: 'HERE COME DOTS',
        options: ['HERE COME DOTS', 'DOTS COME HERE', 'CODE MORE SET', 'THOSE CODE REM']
    },
    {
        id: '10',
        question: 'SLOT MACHINES',
        answer: 'CASH LOST IN ME',
        options: ['CASH LOST IN ME', 'LOST CASH MINE', 'MACHINE SLOTS', 'COINS LOST ME']
    },
    {
        id: '11',
        question: 'SNOOZE ALARMS',
        answer: 'ALAS NO MORE ZS',
        options: ['ALAS NO MORE ZS', 'ZERO ALARMS ON', 'NO MORE SLEEP', 'ZOOM ALARMS']
    }
];

export const riddles: Riddle[] = [...existingRiddles, ...newRiddles];
