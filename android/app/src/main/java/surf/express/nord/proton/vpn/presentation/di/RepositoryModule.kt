package surf.express.nord.proton.vpn.presentation.di

import surf.express.nord.proton.vpn.data.repository.UserRepositoryImpl
import surf.express.nord.proton.vpn.domain.repository.ServerRepository
import surf.express.nord.proton.vpn.domain.repository.UserRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideServerRepository(serverRepositoryImpl: surf.express.nord.proton.vpn.data.repository.ServerRepositoryImpl): ServerRepository {
        return serverRepositoryImpl
    }

    @Provides
    @Singleton
    fun provideUserRepository(userRepositoryImpl: UserRepositoryImpl): UserRepository {
        return userRepositoryImpl
    }
}