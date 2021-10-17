# MidiAmp

Node.js based MIDI velocity transformer build on top of [easyMidi](https://github.com/dinchak/node-easymidi)

A browser based version with visualization (currently in development) is available at [https://tuzemec.com/wma/](https://tuzemec.com/wma/)

## Installation

```bash
npm install midiamp -g
```

## Usage

```bash
midiamp -m 20 -x 120
```
Shows a list of all available midi input ports. Once one is selected, it will create a new virtual midi device named MidiAmp. The velocity of all **noteon** messages from the selected port will be scaled so they are always between 20 and 120. The rest of the midi message will be passed through unmodified.

## Options

| Option | Alias | Description | Default Value |
| ------ | ----- | ----------- | ------------- |
| --input [name] | -i | Specifies the input device. If the device exists, will skip the selection menu. | - |
| --name [name] | -n | Name for the newly created midi device | MidiAmp |
| --min [value] | -m | Minimum velocity value | 1 |
| --max [value] | -x | Maximum velocity value | 127 |
| --verbose | -v | Displays velocity transformations | - |
| --all | -a | Logs ALL received note data | - |
| --help | -h | Displays all the available options | - |

## Examples

```bash
midiamp -i "KOMPLETE KONTROL M32" -m 20
```

Will create a new virtual midi device MidiAmp that will accept input from "KOMPLETE KONTROL M32" and make sure that the minimum velocity is 20


```bash
midiamp -i "KOMPLETE KONTROL M32" -m 20 -x 100 -n MyMidiDevice
```

Same as the above, but the name of the new device will be **MyMidiDevice** and the velocity will be scaled between 20 and 100.

## Why?

Because I've got frustrated with the bad velocity curve on my KOMPLETE KONTROL M32. But it's a nice small keyboard otherwise.

## License

MIT License

Copyright (c) 2021 Stamen Georgiev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
