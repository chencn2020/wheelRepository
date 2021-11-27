/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { keychain } from './common/keychain';
import { GitHubServer } from './githubServer';
import Logger from './common/logger';

export const onDidChangeSessions = new vscode.EventEmitter<void>();

interface SessionData {
	id: string;
	accountName: string;
	scopes: string[];
	accessToken: string;
}

export class GitHubAuthenticationProvider {
	private _sessions: vscode.AuthenticationSession[] = [];
	private _githubServer = new GitHubServer();

	public async initialize(): Promise<void> {
		this._sessions = await this.readSessions();
		this.pollForChange();
	}

	private pollForChange() {
		setTimeout(async () => {
			const storedSessions = await this.readSessions();
			let didChange = false;

			storedSessions.forEach(session => {
				const matchesExisting = this._sessions.some(s => s.id === session.id);
				// Another window added a session to the keychain, add it to our state as well
				if (!matchesExisting) {
					this._sessions.push(session);
					didChange = true;
				}
			});

			this._sessions.map(session => {
				const matchesExisting = storedSessions.some(s => s.id === session.id);
				// Another window has logged out, remove from our state
				if (!matchesExisting) {
					const sessionIndex = this._sessions.findIndex(s => s.id === session.id);
					if (sessionIndex > -1) {
						this._sessions.splice(sessionIndex, 1);
					}

					didChange = true;
				}
			});

			if (didChange) {
				onDidChangeSessions.fire();
			}

			this.pollForChange();
		}, 1000 * 30);
	}

	private async readSessions(): Promise<vscode.AuthenticationSession[]> {
		const storedSessions = await keychain.getToken();
		if (storedSessions) {
			try {
				const sessionData: SessionData[] = JSON.parse(storedSessions);
				return sessionData.map(session => {
					return {
						id: session.id,
						accountName: session.accountName,
						scopes: session.scopes,
						getAccessToken: () => Promise.resolve(session.accessToken)
					};
				});
			} catch (e) {
				Logger.error(`Error reading sessions: ${e}`);
			}
		}

		return [];
	}

	private async storeSessions(): Promise<void> {
		const sessionData: SessionData[] = await Promise.all(this._sessions.map(async session => {
			const resolvedAccessToken = await session.getAccessToken();
			return {
				id: session.id,
				accountName: session.accountName,
				scopes: session.scopes,
				accessToken: resolvedAccessToken
			};
		}));

		await keychain.setToken(JSON.stringify(sessionData));
	}

	get sessions(): vscode.AuthenticationSession[] {
		return this._sessions;
	}

	public async login(scopes: string): Promise<vscode.AuthenticationSession> {
		const token = await this._githubServer.login(scopes);
		const session = await this.tokenToSession(token, scopes.split(' '));
		await this.setToken(session);
		return session;
	}

	private async tokenToSession(token: string, scopes: string[]): Promise<vscode.AuthenticationSession> {
		const userInfo = await this._githubServer.getUserInfo(token);
		return {
			id: userInfo.id,
			getAccessToken: () => Promise.resolve(token),
			accountName: userInfo.accountName,
			scopes: scopes
		};
	}
	private async setToken(session: vscode.AuthenticationSession): Promise<void> {
		const sessionIndex = this._sessions.findIndex(s => s.id === session.id);
		if (sessionIndex > -1) {
			this._sessions.splice(sessionIndex, 1, session);
		} else {
			this._sessions.push(session);
		}

		this.storeSessions();
	}

	public async logout(id: string) {
		const sessionIndex = this._sessions.findIndex(session => session.id === id);
		if (sessionIndex > -1) {
			this._sessions.splice(sessionIndex, 1);
		}

		this.storeSessions();
	}
}
