export default class StringsEnglish {

	public COMMAND_INIT =
		`Exports the base configuration file for docs_gm and shows the instructions to add the configuration to your project`;

	public CONFIG_INSTRUCTIONS: string[] = [
		`Base configuration file was created at: `,
		`%%FILE%%`,
		`Now, you need to add the configuration to your project. `,
		``,
		`Instructions:`,
		`1 - Open your project in GameMaker:Studio or GameMaker Studio 2.`,
		`2 - Right click on the "Included Files" folder in the resource tree.`,
		`3 - Click on "Insert Included File".`,
		`3 - Navigate to the following path and select the file docs_gm.json.`,
		`%%FILE%%`,
		`4 - Click on the added resource and select Platforms: "None". Then save your project.`,
		``,
		`When you are ready, you can run the "docs_gm generate" command from the `,
		`command line to create the documentation for your project. `,
		`Check the online documentation of docs_gm for more info. `,
		`If you want to edit the configuration right click on the docs_gm.json file on`,
		`your project and select "Show in explorer". Then edit the JSON file with any text editor.`,
	];

	public COMMAND_GENERATE =
		`Generates the documentation HTML files for the specified project path`;

	public OPTION_NO_OPEN =
		`The documentation will not be opened on the browser after the generation`;

	public OPTION_PATTERN =
		`The glob pattern to use to include files in the project documentation`;

	public OPTION_ROOT =
		`The project root GameMaker folder. For example, if you want to document `
		+ `your inventory system, you can use "scripts/inventory_system/"`;

	public OPTION_OUTPUT_FOLDER =
		`The output folder of the documentation`;

	public OPTION_TEMPLATE =
		`The template name to use`;

	public OPTION_DESIGN =
		`The design name. If empty, it will use the first design in the designs list.`;

}
