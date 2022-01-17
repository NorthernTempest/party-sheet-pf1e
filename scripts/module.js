Hooks.on('ready', async () => {
	const PartySheetPf1NPC = (await import("./party.js")).Party;

	Actors.registerSheet("PF1", PartySheetPf1NPC, {
		label: "ps.sheet",
		types: ["npc"],
		makeDefault: false
	})
});