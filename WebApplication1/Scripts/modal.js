$(function () {
    var openModal = function (event) {
        var button = $(event.relatedTarget);
        
        var item = button.data("ref-item");

        angular.element("#item-detail-modal").scope().vm2.details(item);
    }

    $("#item-detail-modal").on("show.bs.modal", null, null, openModal);
})