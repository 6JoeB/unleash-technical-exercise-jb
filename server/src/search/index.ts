import TrieSearch from "trie-search";
import path from "path";
import fs from "fs";

interface Address {
  city: string;
  county: string;
  district: string;
  municipality: string;
  municipalityNumber: number;
  postNumber: number;
  street: string;
  type: string;
  typeCode: number;
}


const dataPath = path.join(process.cwd(), "data/addresses.json");

export class AddressSearch {
  private trie: any;
  private addresses: Address[];

  constructor() {
    this.trie = new TrieSearch(["street", "city", "county"]);
    this.addresses = [];
  }

  loadSync() {
    const raw = fs.readFileSync(dataPath, "utf8");
    const parsed: Address[] = JSON.parse(raw);

    this.addresses = parsed.map((a) => ({
      ...a,
      street: a.street || "",
      city: a.city || ""
    }));
    this.trie.addAll(this.addresses);
  }

  search(query: string, limit = 20): Address[] {
    if (!query || query.trim().length < 3) return [];

    const results = this.trie.get(query);

    const unique = new Map<string, Address>();
    for (const r of results) {
      const key = `${r.street}|${r.postNumber}|${r.city}`;
      if (!unique.has(key)) unique.set(key, r);
      if (unique.size >= limit) break;
    }
    return Array.from(unique.values()).slice(0, limit);
  }
}
