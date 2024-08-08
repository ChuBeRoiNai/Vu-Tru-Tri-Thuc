var app = angular.module("myApp", ["ngRoute"]);

app.controller("myCtrl", function ($scope, $rootScope, $sce, $routeParams, $http, $location) {
    $scope.products = [];
    $scope.users = [];
    $scope.searchKeyword = '';

    // Lấy dữ liệu sản phẩm từ tệp JSON
    $http.get("/data/data.json").then(function (response) {
        $scope.products = response.data;
        for (let i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].id == $routeParams.id) {
                $scope.index = i;
            }
        }
    });

    // Thêm sản phẩm vào giỏ hàng
    $scope.addCart = function (product) {
        if (typeof $rootScope.cart == 'undefined') {
            $rootScope.cart = [];
        }
        var index = $rootScope.cart.findIndex((item) => item.id == product.id);
        if (index === -1) {
            product.quantity = 1;
            $rootScope.cart.push(product);
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng
    $scope.removeCart = function (productId) {
        var index = $rootScope.cart.findIndex((item) => item.id == productId);
        if (index !== -1) {
            $rootScope.cart.splice(index, 1);
        }
    };

    // Tính tổng giá trị giỏ hàng
    $scope.calculateTotal = function () {
        var total = 0;
        for (var i = 0; i < $rootScope.cart.length; i++) {
            total += $rootScope.cart[i].price * $rootScope.cart[i].quantity;
        }
        return total;
    };

    // Sắp xếp sản phẩm theo giá tăng dần
    $scope.sort = 'price';
    $scope.tang = function () {
        $scope.sort = 'price';
    };

    // Sắp xếp sản phẩm theo giá giảm dần
    $scope.giam = function () {
        $scope.sort = '-price';
    };

    // Tìm kiếm sản phẩm theo từ khóa
    $scope.searchProduct = function () {
        $rootScope.keySearch = $scope.searchKeyword.toLowerCase();
        if ($scope.products.length === 0) {
            $('#notFoundModal').modal('show');
        } else {
            $location.path('/timkiem');
        }
    };

    // Theo dõi thay đổi từ khóa tìm kiếm
    $scope.$watch('searchKeyword', function (newVal) {
        if (!newVal) {
            $rootScope.keySearch = '';
        }
    });
    // Biến để lưu thể loại sách đã chọn
    $scope.selectedKind = '';

    // Hàm để chọn thể loại
    $scope.selectKind = function (kind) {
        $scope.selectedKind = kind;
    };
    // // Biến để lưu thể loại sách đã chọn
    // $rootScope.selectedlink = '';
    // // thêm
    // $rootScope.selectedlink = function (link) {
    //     $rootScope.selectedlink = link
    // };

    $rootScope.trustedPdfUrl = '';

    // Hàm để mở PDF
    $rootScope.openPdf = function (link) {
        $scope.trustedPdfUrl = $sce.trustAsResourceUrl(link);
    };





    // Lấy dữ liệu người dùng từ server
    $http.get("http://localhost:3000/User").then(function (response) {
        $scope.users = response.data;
    });

    // Đăng ký người dùng mới
    $scope.register = function () {
        var newUserId = $scope.users.length + 1;
        var userData = {
            id: newUserId,
            username: $scope.username,
            email: $scope.email,
            phone: $scope.phone,
            password: $scope.password
        };

        $http.post('http://localhost:3000/User', userData)
            .then(function () {
                $scope.users.push(userData);
                $scope.username = "";
                $scope.email = "";
                $scope.phone = "";
                $scope.password = "";
                $scope.confirmPassword = "";
            })
            .catch(function (error) {
                console.error("Đã xảy ra lỗi trong quá trình đăng ký", error);
            });
    };

    // Danh sách tài khoản tạm thời để kiểm tra đăng nhập
    $scope.listAccount = [
        { username: "user1", pass: "password1" },
        { username: "user2", pass: "password2" }
    ];

    // Hàm đăng nhập
    $scope.login = function () {
        var existingUser = $scope.listAccount.find(function (user) {
            return user.username === $scope.username && user.pass === $scope.password;
        });

        if (existingUser) {
            alert('Đăng nhập thành công!');
            $location.path('/home');
        } else {
            alert('Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
        }
    };
});



// Cấu hình route cho ứng dụng
app.config(function ($routeProvider) {
    $routeProvider
        .when("/gioithieu", {
            templateUrl: "/layout/gioithieu.html?" + Math.random(),
            controller: "myCtrl"
        })
        .when("/bookshelf", {
            templateUrl: "/layout/bookshelf.html?" + Math.random(),
            controller: "myCtrl"
        })
        .when("/lienhe", {
            templateUrl: "/layout/lienhe.html?" + Math.random(),
            controller: "myCtrl"
        })
        .when("/category", {
            templateUrl: "/layout/category.html?" + Math.random(),
            controller: "myCtrl"
        })
        .when("/timkiem", {
            templateUrl: "/layout/timkiem.html?" + Math.random(),
            controller: "myCtrl"
        })
        .when("/news", {
            templateUrl: "/layout/news.html?" + Math.random(),
            controller: "myCtrl"
        })
        .when("/detail/:id", {
            templateUrl: "/layout/productdetails.html?" + Math.random(),
            controller: "myCtrl"
        })
        .when("/genre", {
            templateUrl: "/layout/genre.html?" + Math.random(),
            controller: "myCtrl",
        })
        .when("/gopy", {
            templateUrl: "/layout/gopy.html?" + Math.random(),
            controller: "myCtrl",
        })
        .when("/doc", {
            templateUrl: "/layout/doc.html?" + Math.random(),
            controller: "myCtrl",
        })
        .when("/cart", {
            templateUrl: "/layout/cart.html?" + Math.random(),
            controller: "myCtrl"
        })
        .otherwise({
            templateUrl: "/layout/products.html",
            controller: "myCtrl"
        });
});
