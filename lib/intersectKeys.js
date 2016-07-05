module.exports = function intersectKeys (_a, _b) {
  let ai = 0
  let bi = 0
  let a = Object.keys(_a)
  let b = Object.keys(_b)
  const result = []

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
