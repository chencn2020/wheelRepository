import { Application } from "../../common/api";
export declare const Vscode: Application;
export declare const findApplications: () => Promise<readonly Application[]>;
export declare const findWhitelistedApplications: () => Promise<readonly Application[]>;
