module.exports = (_a, _b) => {
  let ai = 0
  let bi = 0
  const result = []
  const a = Object.keys(_a).sort()
  const b = Object.keys(_b).sort()

  while (ai < a.length && bi < b.length) {
    if (a[ai] < b[bi]) {
      ai++
    } else if (a[ai] > b[bi]) {
      bi++
    } else {
      result.push(a[ai])
      ai++
      bi++
    }
  }

  return result
}
