(function (exports) {
  var Items = React.createClass({
    getDefaultProps: function () {
      return { items: [] };
    },
    render: function () {
      var self = this;
      var items = this.props.items.map(function (item) {
        var itm = cItem(item);
        return <li>{itm}</li>;
      });
      return (
        <ul className="items">
          {items}
        </ul>
      );
    }
  });
  exports.cItems = Items;
}).call(this, window);
