package surf.express.nord.proton.vpn.domain.model

data class Package(
    var __v: Int?,
    var createdAt: String?,
    var id: String?,
    var packageDuration: String?,
    var packageId: String?,
    var packageName: String?,
    var packagePlatform: String?,
    var packagePricing: Int?
) {
    companion object {
        fun fromObject(packageObject: surf.express.nord.proton.vpn.data.remote.model.PackageObject): Package {
            return Package(
                __v = packageObject.v,
                createdAt = packageObject.createdAt,
                id = packageObject.id,
                packageDuration = packageObject.packageDuration,
                packageId = packageObject.packageId,
                packageName = packageObject.packageName,
                packagePricing = packageObject.packagePricing,
                packagePlatform = packageObject.packagePlatform
            )
        }
    }
}