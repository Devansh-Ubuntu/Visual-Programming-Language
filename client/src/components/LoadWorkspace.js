export const loadWorkspace = (callback) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        console.log("Workspace loaded.");
        callback(data);
      } catch (err) {
        console.error("Error parsing workspace file:", err);
      }
    };
    reader.readAsText(file);
  };
  input.click();
};
