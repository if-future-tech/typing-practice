// ImageWithFallback.js

// Base64 のエラー画像（React版と同じ）
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

/**
 * 画像にフォールバック処理を付与する
 * @param {HTMLImageElement} imgEl - 対象の <img> 要素
 */
export function attachImageFallback(imgEl) {
  if (!imgEl) return;

  imgEl.addEventListener('error', () => {
    const wrapper = document.createElement('div');
    wrapper.className = `inline-block bg-gray-100 text-center align-middle ${imgEl.className}`;
    wrapper.style.cssText = imgEl.style.cssText;

    const inner = document.createElement('div');
    inner.className = 'flex items-center justify-center w-full h-full';

    const fallbackImg = document.createElement('img');
    fallbackImg.src = ERROR_IMG_SRC;
    fallbackImg.alt = 'Error loading image';
    fallbackImg.setAttribute('data-original-url', imgEl.src);

    inner.appendChild(fallbackImg);
    wrapper.appendChild(inner);

    imgEl.replaceWith(wrapper);
  });
}
