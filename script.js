const SUPABASE_URL = "https://saqthplxozqmbvsniicb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vKkChTiLjI-lIfTvNh4VBg_lBwfpgVP";

const supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Upload file
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file");
    return;
  }

  const fileName = Date.now() + "_" + file.name;

  const { error } = await supabase
    .storage
    .from("files")
    .upload(fileName, file);

  if (error) {
    alert("Upload failed");
    console.error(error);
  } else {
    alert("Upload successful");
    loadFiles();
  }
}

// Load files
async function loadFiles() {
  const { data, error } = await supabase
    .storage
    .from("files")
    .list("");

  if (error) {
    console.error(error);
    return;
  }

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  data.forEach(file => {
    const { data: urlData } = supabase
      .storage
      .from("files")
      .getPublicUrl(file.name);

    const li = document.createElement("li");
    li.innerHTML = `<a href="${urlData.publicUrl}" target="_blank">${file.name}</a>`;
    list.appendChild(li);
  });
}

loadFiles();
