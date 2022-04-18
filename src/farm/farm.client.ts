import * as anchor from '@project-serum/anchor';
import { BN, Idl, Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import {
  AccountInfo,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Farm } from '../../target/types/farm';
import { AccountUtils } from '../farm-common';

export class FarmClient extends AccountUtils {
  // @ts-ignore
  wallet: anchor.Wallet;
  provider!: anchor.Provider;
  farmProgram!: anchor.Program<Farm>;

  constructor(
    conn: Connection,
    // @ts-ignore
    wallet: anchor.Wallet,
    idl?: Idl,
    programId?: PublicKey
  ) {
    super(conn);
    this.wallet = wallet;
    this.setProvider();
    this.setFarmProgram(idl, programId);
  }

  setProvider() {
    this.provider = new AnchorProvider(
      this.conn,
      this.wallet,
      AnchorProvider.defaultOptions()
    );
    anchor.setProvider(this.provider);
  }

  setFarmProgram(idl?: Idl, programId?: PublicKey) {
    //instantiating program depends on the environment
    if (idl && programId) {
      //means running in prod
      this.farmProgram = new anchor.Program<Farm>(
        idl as any,
        programId,
        this.provider
      );
    } else {
      //means running inside test suite
      // @ts-ignore
      this.farmProgram = anchor.workspace.Farm as Program<Farm>;
    }
  }
}