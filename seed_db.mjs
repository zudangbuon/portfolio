import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lskfvhhssxumoawpjrro.supabase.co';
const supabaseKey = 'sb_publishable_XRG9LK-6zb5O9pEuDs878g_QcOh0D-3';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding Projects...");
  const projects = [
    { title: "Linux Infrastructure & Security Labs", category: "Infrastructure", tags: ["Debian", "SSH", "Prometheus", "Grafana", "RAID5", "iptables", "Bash"], description: "Deployed WordPress + MariaDB on multiple VMs with remote SSH administration. Set up monitoring with Prometheus + Grafana. Built backup system with RAID5 + LVM + NFS. Designed multi-subnet network with iptables firewall rules." },
    { title: "Multi-Client File Transfer Server", category: "Networking", tags: ["C/C++", "Sockets", "Networking"], description: "Network programming course project — a multi-client file transfer server built with socket programming." }
  ];
  for (const p of projects) {
    const { error } = await supabase.from('projects').insert(p);
    if(error) console.error("Error inserting project:", error);
  }

  console.log("Seeding CTFs...");
  const ctfs = [
    { name: "THEM?!CTF 2026", rank: "12/922", year: 2026, tags: ["Forensics", "Misc", "OSINT", "Web", "Pwn"] },
    { name: "HCMUS CTF 2026", rank: "22/86", year: 2026, tags: ["Forensics", "Reverse Engineering", "Misc"] },
    { name: "Hacktheon Sejong 2026", rank: "65/155", year: 2026, tags: ["Forensics", "Reverse Engineering", "AI"] },
    { name: "Cybersecurity Student Contest Vietnam", rank: "100/367", year: 2025, tags: ["Forensics", "Reverse Engineering"] }
  ];
  for (const c of ctfs) {
    const { error } = await supabase.from('ctfs').insert(c);
    if(error) console.error("Error inserting ctf:", error);
  }

  console.log("Seeding Skills...");
  const skills = [
    { name: "C/C++", level: 80, category: "frontend" },
    { name: "Python", level: 85, category: "frontend" },
    { name: "Java", level: 65, category: "frontend" },
    { name: "SQL", level: 75, category: "frontend" },
    { name: "Bash / Shell", level: 78, category: "frontend" },
    { name: "Burp Suite", level: 80, category: "backend" },
    { name: "Wireshark", level: 75, category: "backend" },
    { name: "Nmap", level: 82, category: "backend" },
    { name: "Ghidra", level: 70, category: "backend" },
    { name: "Git", level: 85, category: "backend" },
    { name: "AI Tools", level: 80, category: "backend" },
    { name: "Kali Linux", level: 85, category: "tools" },
    { name: "Ubuntu", level: 80, category: "tools" },
    { name: "Debian", level: 82, category: "tools" },
    { name: "Windows", level: 90, category: "tools" },
    { name: "Google Workspace", level: 88, category: "tools" }
  ];
  for (const s of skills) {
    const { error } = await supabase.from('skills').insert(s);
    if(error) console.error("Error inserting skill:", error);
  }

  console.log("Done seeding.");
}

seed();
