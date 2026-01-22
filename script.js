/***********************
 * SUPABASE CONFIG
 ***********************/
const SUPABASE_URL = "https://saqthplxozqmbvsniicb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vKkChTiLjI-lIfTvNh4VBg_lBwfpgVP";
const BUCKET_NAME = "uploads"; // must exist
const STORAGE_LIMIT_MB = 500;

// ✅ FIX: DO NOT redeclare `supabase`
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/***********************
 * UPLOAD FILE
 ***********************/
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file first");
    return;
  }

  status.innerText = "Uploading...";

  const filePath = `${Date.now()}_${file.name}`;

  try {
    const { data, error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        upsert: false,
        metadata: { size: file.size }
      });

    if (error) {
      console.error("Supabase upload error:", error);
      status.innerText = "Upload failed ❌";
      alert(error.message);
      return;
    }

    console.log("Upload success:", data);
    status.innerText = "Upload successful ✅";
    fileInput.value = "";
    fetchFiles();

  } catch (err) {
    console.error("Unexpected error:", err);
    status.innerText = "Upload error ❌";
  }
}

/***********************
 * FETCH FILES + STORAGE
 ***********************/
async function fetchFiles() {
  const { data: files, error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .list("", { limit: 1000 });

  if (error) {
    console.error("Fetch error:", error.message);
    return;
  }

  let totalBytes = 0;
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  files.forEach(file => {
    const size = file.metadata?.size || 0;
    totalBytes += size;

    fileList.innerHTML += `
      <div class="file">
        <span>${file.name}</span>
        <button onclick="deleteFile('${file.name}')">Delete</button>
      </div>
    `;
  });

  updateStorageUI(totalBytes);
}

/***********************
 * DELETE FILE
 ***********************/
async function deleteFile(fileName) {
  const confirmDelete = confirm("Are you sure you want to delete this file?");
  if (!confirmDelete) return;

  const { error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .remove([fileName]);

  if (error) {
    alert("Delete failed: " + error.message);
  } else {
    document.getElementById("status").innerText = "File deleted";
    fetchFiles();
  }
}

/***********************
 * STORAGE UI UPDATE
 ***********************/
function updateStorageUI(totalBytes) {
  const usedMB = (totalBytes / (1024 * 1024)).toFixed(2);
  const percentage = (usedMB / STORAGE_LIMIT_MB) * 100;

  document.getElementById("storageText").innerText =
    `${usedMB} MB of ${STORAGE_LIMIT_MB} MB used`;

  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${Math.min(percentage, 100)}%`;
  progressBar.style.background =
    percentage > 90 ? "#ff4d4f" : "#3ecf8e";

  document.getElementById("percentageText").innerText =
    `${percentage.toFixed(1)}% used`;
}

/***********************
 * INITIAL LOAD
 ***********************/
fetchFiles();
