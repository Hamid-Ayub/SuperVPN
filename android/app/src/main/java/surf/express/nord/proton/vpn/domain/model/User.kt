package surf.express.nord.proton.vpn.domain.model

data class User(
    val createdAt: String? = null,
    val email: String? = null,
    val firstName: String? = null,
    val id: String? = null,
    val lastName: String? = null,
    val isAnonymous: Boolean = false
) {
    companion object {
        fun fromObject(userObject: surf.express.nord.proton.vpn.data.remote.model.UserObject?): User {
            return User(
                createdAt = userObject?.createdAt,
                email = userObject?.email,
                firstName = userObject?.firstName,
                id = userObject?.id,
                lastName = userObject?.lastName,
                isAnonymous = userObject?.isAnonymous ?: false
            )
        }

    }

    var ads: List<Ads> = listOf()
    var packages: List<Package> = listOf()
}