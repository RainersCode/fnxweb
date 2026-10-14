// Position names as Latvian rugby uses them (federation news, sportacentrs.com, Nacionālā enciklopēdija).
// Left/right and inside/outside have no settled Latvian names, so those are told apart by number.
export type RugbyPosition = {
  numbers: number[]
  name: string
  group: 'uzbrucēji' | 'aizsargi'
  role: string
}

export const RUGBY_POSITIONS: RugbyPosition[] = [
  { numbers: [1, 3], name: 'Stabs', group: 'uzbrucēji', role: 'Pirmās līnijas malās. Balsta grupu cīņu un ceļ lēcēju autā.' },
  { numbers: [2], name: 'Hukers', group: 'uzbrucēji', role: 'Pirmās līnijas vidū. Grupu cīņā izcīna bumbu ar kāju, autā iemet bumbu.' },
  { numbers: [4, 5], name: 'Otrās līnijas spēlētājs', group: 'uzbrucēji', role: 'Parasti garākie komandā. Lec autā un dod spēku grupu cīņai.' },
  { numbers: [6, 7], name: 'Trešās līnijas spēlētājs', group: 'uzbrucēji', role: 'Pirmie pie bumbas pēc tvēriena. Daudz tver un cīnās rakos.' },
  { numbers: [8], name: '8. numurs', group: 'uzbrucēji', role: 'Grupu cīņas aizmugurē. Var pats paņemt bumbu un skriet.' },
  { numbers: [9], name: 'Cīņas pussargs', group: 'aizsargi', role: 'Izņem bumbu no grupu cīņām un rakiem un piespēlē tālāk.' },
  { numbers: [10], name: 'Brīvais pussargs', group: 'aizsargi', role: 'Vada uzbrukumu: izlemj, piespēlēt, skriet vai sist.' },
  { numbers: [12, 13], name: 'Centrs', group: 'aizsargi', role: 'Lauž pretinieku aizsardzību un daudz tver.' },
  { numbers: [11, 14], name: 'Malējais trīsceturtdaļnieks', group: 'aizsargi', role: 'Ātrākie komandā. Pabeidz uzbrukumus gar laukuma malām.' },
  { numbers: [15], name: 'Pēdējais aizsargs', group: 'aizsargi', role: 'Pēdējā aizsardzības līnija. Ķer garos sitienus un pievienojas uzbrukumam.' },
]

// Suggestions for the admin player form
export const POSITION_NAMES = RUGBY_POSITIONS.map((p) => p.name)
