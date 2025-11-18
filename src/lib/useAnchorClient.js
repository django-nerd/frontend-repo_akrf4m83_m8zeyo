import { useEffect, useMemo, useState, useCallback } from 'react'
import * as anchor from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

// Simple wallet adapter wrapper for window.solana (Phantom etc.)
function makeWindowWalletAdapter(solWallet) {
  if (!solWallet) return null
  return {
    publicKey: solWallet.publicKey || null,
    async signTransaction(tx) {
      if (!solWallet.signTransaction) throw new Error('Wallet does not support signTransaction')
      return await solWallet.signTransaction(tx)
    },
    async signAllTransactions(txs) {
      if (!solWallet.signAllTransactions) throw new Error('Wallet does not support signAllTransactions')
      return await solWallet.signAllTransactions(txs)
    },
    async connect() {
      await solWallet.connect()
      this.publicKey = solWallet.publicKey
    },
    async disconnect() {
      if (solWallet.disconnect) await solWallet.disconnect()
      this.publicKey = null
    },
  }
}

export function useAnchorClient(baseUrl) {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [connected, setConnected] = useState(false)

  // Load on-chain config from backend
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const r = await fetch(`${baseUrl}/api/onchain/config`)
        const j = await r.json()
        if (mounted) setConfig(j)
      } catch (e) {
        if (mounted) setError(String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [baseUrl])

  // Wallet connect
  const connectWallet = useCallback(async () => {
    try {
      const sol = window?.solana
      if (!sol) throw new Error('No wallet found. Install Phantom or a Solana wallet.')
      const resp = await sol.connect()
      const adapter = makeWindowWalletAdapter(sol)
      setWallet(adapter)
      setConnected(true)
      return resp?.publicKey?.toBase58?.() || sol.publicKey?.toBase58?.() || null
    } catch (e) {
      setError(String(e))
      throw e
    }
  }, [])

  const disconnectWallet = useCallback(async () => {
    try {
      if (wallet?.disconnect) await wallet.disconnect()
    } finally {
      setWallet(null)
      setConnected(false)
    }
  }, [wallet])

  const provider = useMemo(() => {
    if (!config) return null
    const connection = new Connection(config.rpc || 'https://api.devnet.solana.com', 'confirmed')
    // AnchorProvider expects an object with publicKey, signTransaction, signAllTransactions
    const walletAdapter = wallet || { publicKey: null, signTransaction: async (tx) => tx, signAllTransactions: async (txs) => txs }
    return new anchor.AnchorProvider(connection, walletAdapter, { preflightCommitment: 'confirmed' })
  }, [config, wallet])

  const program = useMemo(() => {
    try {
      if (!config || !provider) return null
      const idl = config.idl
      const programId = new PublicKey(config.programId)
      return new anchor.Program(idl, programId, provider)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Program init failed:', e)
      return null
    }
  }, [config, provider])

  const state = {
    ready: Boolean(config),
    loading,
    error,
    cluster: config?.cluster,
    rpc: config?.rpc,
    programId: config?.programId,
    treasury: config?.treasury,
    mintAuthority: config?.mintAuthority,
    idl: config?.idl,
    connected,
    publicKey: wallet?.publicKey ? wallet.publicKey.toBase58() : null,
    connectWallet,
    disconnectWallet,
    provider,
    program,
  }

  return state
}
