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
    name: "amp",
    description: "Amplifier value (default: 10)",
    alias: "a",
    type: Number,
    defaultValue: 10,
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
    alias: "l",
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

async function askForDevice(message) {
  const response = await prompts({
    initial: 1,
    type: "select",
    name: "device",
    message,
    choices: devices.map((d) => ({
      title: d,
    })),
  });

  options.input = devices[response.device];
}

function amplify() {
  const input = new easymidi.Input(options.input);
  const output = new easymidi.Output(options.name, true);

  input.on("message", function (msg) {
    options.all && console.log(msg);
    if (msg._type === "noteon") {
      const velocity = Math.max(
        options.min,
        Math.min(msg.velocity + options.amp, 127)
      );
      output.send("noteon", { ...msg, velocity });
      options.verbose &&
        console.log("Amplifying", msg.velocity, " => ", velocity);
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

  if (!options.name || !devices.includes(options.name)) {
    await askForDevice(
      options.input
        ? `\nCan't find the specified device ${chalk.red.bold(options.input)}`
        : "\nNo device specified, please select from the list"
    );
  }

  console.log(
    "\nAttaching to",
    chalk.blue(options.input),
    "amplifying with",
    chalk.green(options.amp)
  );
  console.log("Opening midi port", chalk.green.bold(options.name), "\n");
  console.log(chalk.white.bold("CTRL+C"), "to exit...\n");

  amplify();
})();