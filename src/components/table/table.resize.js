import { $ } from '@core/dom';

export function resizeHeandler(event, $root) {
  return new Promise((resolve) => {
    const resizeAttribute = event.target.dataset.resize;
    const $resizer = $(event.target);
    // const $parent = $resizer.$el.parentNode; bad
    // const $parent = $resizer.$el.closest('.column'); better but bad
    const $parent = $resizer.closest('[data-type="resizable"]');
    const coords = $parent.getCoords();
    const resizeValue = resizeAttribute === 'col' ? 'width' : 'height';
    const colId = $parent.data.col;
    let value;

    $resizer.css({ opacity: 1 });

    document.onmousemove = (e) => {
      const delta = getDelta(e, resizeValue, coords);

      value = Math.floor(coords[resizeValue] + delta);

      if (resizeAttribute === 'col') {
        $resizer.css({
          right: -delta + 'px',
          bottom: '-5000px',
        });
      } else {
        $resizer.css({
          bottom: -delta + 'px',
          right: '-5000px',
        });
      }
    };

    document.onmouseup = (e) => {
      document.onmousemove = null;
      document.onmouseup = null;

      const styles = {
        [resizeValue]: value + 'px',
      };

      $parent.css(styles);

      if (resizeAttribute === 'col') {
        $root.findAll(`[data-col="${colId}"]`).forEach((v) => {
          $(v).css(styles);
        });
      }

      resolve({
        value,
        type: resizeAttribute,
        id: $parent.data[resizeAttribute],
      });

      $resizer.css({ opacity: 0, bottom: 0, right: 0 });
    };
  });
}

function getDelta(e, resizeValue, coords) {
  return Math.floor(
    resizeValue === 'width' ? e.pageX - coords.right : e.pageY - coords.bottom
  );
}
