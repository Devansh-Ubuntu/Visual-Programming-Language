export const saveWorkspace = (workspaceData, filename = "workspace.xml") => {
  try {
    if (!workspaceData || workspaceData.trim() === "") {
      throw new Error(" Workspace data is empty or undefined.");
    }

    const blob = new Blob([workspaceData], { type: "text/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    // Append to document to make sure it's clickable in all browsers
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log(` Workspace saved successfully as '${filename}'`);

    // Free memory after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 100);
    console.log(`Workspace saved successfully as '${filename}'`);
  } catch (err) {
    console.error(" Error saving workspace:", err);
  }
};
