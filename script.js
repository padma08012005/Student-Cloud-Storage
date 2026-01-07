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
    alert("Select a file first");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from("files")
    .upload(fileName, file);

  if (error) {
    alert("Upload failed");
    console.log(error);
  } else {
    alert("File uploaded!");
    listFiles();
  }
}

// List files
async function listFiles() {
  const { data, error } = await supabase.storage
    .from("files")
    .list();

  if (error) {
    console.log(error);
    return;
  }

  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  data.forEach(file => {
    const li = document.createElement("li");

    const { data: urlData } = supabase.storage
      .from("files")
      .getPublicUrl(file.name);

    li.innerHTML = `<a href="${urlData.publicUrl}" target="_blank">${file.name}</a>`;
    fileList.appendChild(li);
  });
}

// Load files on page load
listFiles();
