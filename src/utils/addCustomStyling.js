export function addCustomStyling(html) {
  if (!html) return "";

  return html
    .replaceAll(
      /<h1(.*?)>/g,
      '<h1 class="text-2xl font-semibold text-gray-800 mb-4" $1>'
    )
    .replaceAll(
      /<h2(.*?)>/g,
      '<h2 class="text-xl font-semibold text-gray-700 mt-6 mb-3" $1>'
    )
    .replaceAll(
      /<h3(.*?)>/g,
      '<h3 class="text-lg font-semibold text-gray-700 mt-4 mb-2" $1>'
    )
    .replaceAll(
      /<p(.*?)>/g,
      '<p class="mb-4 text-gray-600 leading-relaxed" $1>'
    )
    .replaceAll(
      /<a(.*?)>/g,
      '<a class="text-blue-600 underline hover:text-blue-800" $1>'
    )
    .replaceAll(
      /<ul(.*?)>/g,
      '<ul class="list-disc pl-6 mb-4 text-gray-600" $1>'
    )
    .replaceAll(
      /<ol(.*?)>/g,
      '<ol class="list-decimal pl-6 mb-4 text-gray-600" $1>'
    )
    .replaceAll(/<li(.*?)>/g, '<li class="mb-1" $1>');
}