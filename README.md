# TEE

Source for [tee.foundation](https://tee.foundation) — a plain-spoken
explanation of Trusted Execution Environments, aimed at engineers rather
than cryptographers.

This is the one site in the Foundation network where the underlying
security property is hardware, not math — see `/what-is-a-tee` for why
that's a real, load-bearing difference, not a simplification. The
interactive demo computes the cryptographic half of remote attestation for
real in your browser; the actual hardware memory isolation a TEE relies on
cannot be computed or simulated in JavaScript, and the site says so
directly rather than glossing over it. Every historical claim is sourced
(see `/history` and `/further-reading`), including a full account of real
attacks against TEEs (Foreshadow, Plundervolt) as part of the history, not
a footnote. See `/about` for what this site is and how to contribute.

## Stack

- [Astro](https://astro.build) (static output, island architecture)
- Content in MDX (`src/pages/*.mdx`)
- [KaTeX](https://katex.org) for math, via `remark-math`/`rehype-katex`
- [Shiki](https://shiki.style) for code highlighting (Astro's default)
- [`@noble/curves`](https://github.com/paulmillr/noble-curves) +
  [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) for the
  attestation demo (Ed25519 + SHA-256) — see `src/lib/`

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run astro check
```

## Contributing

Corrections and additions are welcome — open an issue or a pull request. See
`/about` on the live site for more.

## License

Code is [MIT](LICENSE). Written content is [CC-BY 4.0](LICENSE-CONTENT.md).
