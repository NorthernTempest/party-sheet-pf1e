Hooks.on('ready', async () => {
	const PartySheetPf1NPC = (await import("./pf1e-party-sheet.js")).PartySheetPf1NPC;

	Actors.registerSheet("PF1", PartySheetPf1NPC, {
		types: ["npc"],
		makeDefault: false
	})
});