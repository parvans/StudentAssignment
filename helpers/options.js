export default {
    formate: {
        orientation: 'portrait',
        format: 'A4',
        border: '8mm',
        header: {
            height: '15mm',
            content:'<h4 style="text-align:center">Student Report</h4>'
    },
    footer: {
        height: '20mm',
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
    }
}