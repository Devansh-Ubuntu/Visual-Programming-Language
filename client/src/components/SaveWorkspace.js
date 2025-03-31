export const saveWorkspace = (workspaceData, filename = "workspace.json") => {
  try {
    if (!workspaceData) {
      throw new Error("Workspace data is empty or undefined.");
    }

    const jsonString = JSON.stringify(workspaceData, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob); // ✅ Create URL inside try

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    // Append to document to ensure clickability
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log(`✅ Workspace saved successfully as '${filename}'`);

    // ✅ Free memory after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (err) {
    console.error("❌ Error saving workspace:", err);
  }
};
