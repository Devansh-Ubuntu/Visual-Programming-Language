// SaveWorkspace.js
export const saveWorkspace = (workspaceData, filename = "workspace.json") => {
    try {
      const blob = new Blob([JSON.stringify(workspaceData)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      console.log("Workspace saved.");
    } catch (err) {
      console.error("Error saving workspace:", err);
    }
  };
  