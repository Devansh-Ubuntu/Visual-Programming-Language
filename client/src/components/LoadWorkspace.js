export const loadWorkspace = (callback) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xml, text/xml"; 

  input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) {
          console.warn(" No file selected.");
          return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const xmlText = e.target.result.trim();
              if (!xmlText) {
                  throw new Error("File is empty or unreadable.");
              }

              console.log(" Workspace file loaded successfully!");
              callback(xmlText);

          } catch (err) {
              console.error(" Error parsing workspace file:", err);
          }
      };

      reader.readAsText(file);
  };

  input.click();
};
