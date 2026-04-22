function stringToDate(str) {
  const [y, m, d] = str.split('-')
  return new Date(+y, m - 1, +d)
}

function dateToString(date) {
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate())
  )
}

function pad(n, s = String(n)) {
  return s.length < 2 ? `0${s}` : s
}

export default {
  data() {
    return {
      flightType: 'one-way flight',
      departureDate: dateToString(new Date()),
      returnDate: dateToString(new Date())
    }
  },
  computed: {
    isReturn() {
      return this.flightType === 'return flight'
    },
    canBook() {
      return (
        !this.isReturn ||
        stringToDate(this.returnDate) > stringToDate(this.departureDate)
      )
    }
  },
  methods: {
    book() {
      alert(
        this.isReturn
          ? `你已预订一趟往返航班，出发日期为 ${this.departureDate}，返程日期为 ${this.returnDate}。`
          : `你已预订一趟单程航班，出发日期为 ${this.departureDate}。`
      )
    }
  }
}
