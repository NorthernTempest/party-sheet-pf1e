async function preloadTemplates() {
	const templatePaths = [
		"modules/party-sheet-pf1e/templates/parts/inventory.hbs",
		"modules/party-sheet-pf1e/templates/parts/party.hbs",
		"modules/party-sheet-pf1e/templates/parts/quests.hbs",
	];

	return loadTemplates(templatePaths);
};

Hooks.on('ready', async () => {
	const PartySheet = (await import("./party.js")).PartySheet;
	Actors.registerSheet("PF1", PartySheet, {
		label: "ps.sheet",
		types: ["npc"],
		makeDefault: false
	});

	preloadTemplates();
});