import JSZip from "jszip";
import { saveAs } from "file-saver";
import { SpeciesEntry } from "@/types/database";

export async function downloadEntryZip(entry: SpeciesEntry): Promise<void> {
  const zip = new JSZip();
  const folderName = `${entry.commonName.toLowerCase().replace(/\s+/g, "_")}_assets`;
  const folder = zip.folder(folderName) || zip;

  // 1. Add complete metadata and structured blueprint JSON
  folder.file(
    "blueprint_entry.json",
    JSON.stringify(
      {
        id: entry.id,
        commonName: entry.commonName,
        scientificName: entry.scientificName,
        metricScore: entry.metricScore,
        data: entry.data,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  // 2. Add Readme / citation summary
  folder.file(
    "README.txt",
    `Logos Knowledge Standardization Platform
=========================================
Entry: ${entry.commonName} (${entry.scientificName})
Database: ${entry.databaseId}
Metric Score: ${entry.metricScore}%
Published Status: ${entry.status}

Diet: ${entry.data.diet}
Activity: ${entry.data.activity}
Ecology Niche: ${entry.data.ecology.eltonianNiche}
Trophic Level: ${entry.data.ecology.trophicLevel}

Assets included:
- blueprint_entry.json (Structured data)
- Media references & asset links
`
  );

  // 3. Helper to fetch binary blobs with CORS fallback
  const fetchAndAttach = async (url: string, filename: string) => {
    try {
      const resp = await fetch(url, { mode: "cors" });
      if (resp.ok) {
        const blob = await resp.blob();
        folder.file(filename, blob);
        return;
      }
    } catch {
      // If direct fetch fails due to CORS, record asset URL in manifest
    }
    folder.file(`${filename}.url.txt`, `Direct asset URL:\n${url}\n`);
  };

  const tasks: Promise<void>[] = [];

  // Hero image
  if (entry.data.media.heroImage) {
    tasks.push(fetchAndAttach(entry.data.media.heroImage, "hero_illustration.jpg"));
  }

  // Vocalization audio
  if (entry.data.media.vocalizationAudio?.url) {
    tasks.push(
      fetchAndAttach(
        entry.data.media.vocalizationAudio.url,
        entry.data.media.vocalizationAudio.filename || "vocalization.ogg"
      )
    );
  }

  // Gallery items
  if (entry.data.media.gallery) {
    entry.data.media.gallery.forEach((g) => {
      tasks.push(fetchAndAttach(g.url, g.filename || `${g.id}.jpg`));
    });
  }

  // Distribution maps
  if (entry.data.distribution.recognisedMapUrl) {
    tasks.push(fetchAndAttach(entry.data.distribution.recognisedMapUrl, "recognised_distribution_map.png"));
  }
  if (entry.data.distribution.expectedMapUrl) {
    tasks.push(fetchAndAttach(entry.data.distribution.expectedMapUrl, "expected_distribution_map.png"));
  }

  await Promise.all(tasks);

  // Generate ZIP and trigger browser download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${folderName}.zip`);
}

export function downloadSingleFile(url: string, filename: string) {
  fetch(url, { mode: "cors" })
    .then((res) => {
      if (!res.ok) throw new Error("CORS or network error");
      return res.blob();
    })
    .then((blob) => {
      saveAs(blob, filename);
    })
    .catch(() => {
      // Fallback: trigger standard browser link navigation/download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
}
