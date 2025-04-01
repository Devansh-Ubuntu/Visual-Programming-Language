export const saveWorkspace = (workspaceData, filename = "workspace.json") => {
  try {
    if (!workspaceData) {
      throw new Error("Workspace data is empty or undefined.");
    }
    const blob = new Blob([workspaceData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    console.log(`Workspace saved successfully as '${filename}'`);
  } catch (err) {
    console.error("Error saving workspace:", err);
  }
};
