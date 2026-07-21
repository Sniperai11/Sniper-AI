import { IScannerPlugin } from "../../interfaces/IScannerPlugin";
import { NmapScanner } from "../plugins/NmapScanner";
import { NucleiScanner } from "../plugins/NucleiScanner";
import { ZapScanner } from "../plugins/ZapScanner";
import { NiktoScanner } from "../plugins/NiktoScanner";
import { SqlmapScanner } from "../plugins/SqlmapScanner";
import { AmassScanner } from "../plugins/AmassScanner";
import { SubfinderScanner } from "../plugins/SubfinderScanner";
import { WhatWebScanner } from "../plugins/WhatWebScanner";
import { ApkScanner } from "../plugins/ApkScanner";

export class ScannerFactory {
  private static plugins: Map<string, IScannerPlugin> = new Map();

  static {
    // Statically register plugins
    this.registerPlugin(new NmapScanner());
    this.registerPlugin(new NucleiScanner());
    this.registerPlugin(new ZapScanner());
    this.registerPlugin(new NiktoScanner());
    this.registerPlugin(new SqlmapScanner());
    this.registerPlugin(new AmassScanner());
    this.registerPlugin(new SubfinderScanner());
    this.registerPlugin(new WhatWebScanner());
    this.registerPlugin(new ApkScanner());
  }

  public static registerPlugin(plugin: IScannerPlugin): void {
    this.plugins.set(plugin.id.toLowerCase(), plugin);
    console.log(`[ScannerFactory] Registered plugin: ${plugin.name} [ID: ${plugin.id}]`);
  }

  public static getPlugin(id: string): IScannerPlugin | null {
    return this.plugins.get(id.toLowerCase()) || null;
  }

  public static getAllPlugins(): IScannerPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Determine matching scanner plugins based on target and profile
   */
  public static getPluginsForProfile(profile: string): IScannerPlugin[] {
    const all = this.getAllPlugins();
    switch (profile?.toLowerCase()) {
      case "quick":
        return all.filter(p => ["nmap", "whatweb", "subfinder"].includes(p.id));
      case "deep":
      case "active":
        return all.filter(p => ["nmap", "nuclei", "zap", "nikto", "sqlmap"].includes(p.id));
      case "recon":
        return all.filter(p => ["amass", "subfinder", "whatweb"].includes(p.id));
      case "mobile":
        return all.filter(p => ["apk"].includes(p.id));
      default:
        // Default to returning a core representative set
        return all.filter(p => ["nmap", "nuclei"].includes(p.id));
    }
  }
}
