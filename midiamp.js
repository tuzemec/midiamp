#!/usr/bin/env node

const easymidi = require("easymidi");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const prompts = require("prompts");
const chalk = require("chalk");

const optionList = [
  { name: "input", description: "Midi input device", alias: "i", type: String },
  {
    name: "name",
    description: "Virtual Device Name (default: MidiAmp)",
    alias: "n",
    type: String,
    defaultValue: "MidiAmp",
  },
  {
    name: "min",
    description: "Minimum velocity value (default: 1)",
    alias: "m",
    type: Number,
    defaultValue: 1,
  },
  {
    name: "max",
    description: "Maximum velocity value (default: 127)",
    alias: "x",
    type: Number,
    defaultValue: 127,
  },
  {
    name: "verbose",
    description: "Detailed output",
    alias: "v",
    type: Boolean,
  },
  {
    name: "all",
    description: "Output ALL incoming midi messages",
    alias: "a",
    type: Boolean,
  },
  {
    name: "help",
    description: "Display this information",
    alias: "h",
    type: Boolean,
  },
];

const sections = [
  {
    header: "Simple midi noteon amp",
    content:
      "Amplifies the noteOn velocity coming from a selected device and sends it to a new virtual MIDI port",
  },
  {
    header: "Examples:",
    content: `
npm start -i 'MIDIDEVICENAME'
Attach to {bold MIDIDEVICENAME} and aplify with the default +10 velocity

npm start
Asks for device
`,
  },
  {
    header: "Options",
    optionList: optionList,
  },
];

const usage = commandLineUsage(sections);
const options = commandLineArgs(optionList);
const devices = easymidi.getInputs();
let range;

async function askForDevice(message) {
  const response = await prompts({
    initial: 0,
    type: "select",
    name: "device",
    message,
    choices: devices.map((d) => ({
      title: d,
    })),
  });

  options.input = devices[response.device];
}

function transform() {
  const input = new easymidi.Input(options.input);
  const output = new easymidi.Output(options.name, true);

  input.on("message", function (msg) {
    options.all && console.log(msg);
    if (msg._type === "noteon") {
      const p = Math.round((msg.velocity / 127) * 100);
      const newVelocity = options.min + Math.round((p / 100) * range);

      options.verbose && console.log(msg.velocity, " => ", newVelocity);
      output.send("noteon", { ...msg, velocity: newVelocity });
    } else {
      output.send(msg._type, msg);
    }
  });
}

(async () => {
  if (options.help) {
    console.log(usage);
    process.exit(0);
  }

  if (!options.input || !devices.includes(options.input)) {
    await askForDevice(
      options.input
        ? `Can't find the specified device ${chalk.red.bold(
            options.input
          )}, select another one:`
        : "No device specified, please select from the list:"
    );
  }

  options.min = Math.max(0, options.min);
  options.max = Math.min(127, options.max);

  range = Math.abs(options.max - options.min);

  console.log(
    `\nAttaching to ${chalk.blue(
      options.input
    )} with velocity range ${chalk.blue(range)} (min: ${chalk.green(
      options.min
    )}, max: ${chalk.green(options.max)})`
  );

  console.log("Opening midi port", chalk.green.bold(options.name), "\n");
  console.log(chalk.white.bold("CTRL+C"), "to exit...\n");

  transform();
})();
