const SUPABASE_URL = "https://saqthplxozqmbvsniicb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vKkChTiLjI-lIfTvNh4VBg_lBwfpgVP"; // keep correct
const BUCKET_NAME = "uploads"; // ⚠️ MUST MATCH BUCKET NAME

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");

  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file");
    return;
  }

  status.innerText = "Uploading...";

  const filePath = `${Date.now()}_${file.name}`;

  const { data, error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) {
    console.error("Upload error:", error); // 🔥 VERY IMPORTANT
    status.innerText = "Upload error ❌";
    alert(error.message);
    return;
  }

  status.innerText = "Upload successful ✅";
  fileInput.value = "";

  fetchFiles();
}

async function fetchFiles() {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  const { data, error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .list();

  if (error) {
    console.error("List error:", error);
    return;
  }

  data.forEach(file => {
    const div = document.createElement("div");
    div.innerText = file.name;
    fileList.appendChild(div);
  });
}
