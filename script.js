const SUPABASE_URL = "https://saqthplxozqmbvsniicb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vKkChTiLjI-lIfTvNh4VBg_lBwfpgVP";
const BUCKET_NAME = "uploads"; // must exist in Supabase

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Upload file
async function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Select a file first");

  document.getElementById("status").innerText = "Uploading...";

  const filePath = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) {
    alert(error.message);
    document.getElementById("status").innerText = "Upload failed";
  } else {
    document.getElementById("status").innerText = "Upload successful";
    fetchFiles();
  }
}

// List files + calculate storage
async function fetchFiles() {
  const { data: files, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list("", { limit: 1000 });

  if (error) {
    console.error(error);
    return;
  }

  let totalBytes = 0;
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  files.forEach(file => {
    totalBytes += file.metadata?.size || 0;

    fileList.innerHTML += `
      <div class="file">
        ${file.name}
        <button onclick="deleteFile('${file.name}')">Delete</button>
      </div>
    `;
  });

  const mb = (totalBytes / (1024 * 1024)).toFixed(2);
  document.getElementById("storageText").innerText =
    `${mb} MB used`;
}

// Delete file
async function deleteFile(fileName) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([fileName]);

  if (!error) fetchFiles();
}

// Load files on page load
fetchFiles();
