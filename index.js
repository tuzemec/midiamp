const easymidi = require("easymidi");

const INPUT = "KOMPLETE KONTROL M32";
const AMP = 10;

const input = new easymidi.Input(INPUT);
const output = new easymidi.Output("tzmMIDI Output Port", true);

console.log("Available inputs: \n");
easymidi.getInputs().forEach((inputName) => {
  console.log(inputName);
});

console.log("\nAttaching to", INPUT, "amplifying with", AMP);

input.on("message", function (msg) {
  console.log(msg);
  if (msg._type === "noteon") {
    const velocity = Math.min(msg.velocity + AMP, 127);
    output.send("noteon", { ...msg, velocity });
    console.log(msg.velocity, " => ", velocity);
  } else {
    output.send(msg._type, msg);
  }

});
