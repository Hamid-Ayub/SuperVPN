package surf.express.nord.proton.vpn.presentation.di

import android.content.Context
import com.google.gson.FieldNamingPolicy
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import surf.express.nord.proton.vpn.BuildConfig
import surf.express.nord.proton.vpn.R
import surf.express.nord.proton.vpn.presentation.utils.interceptor.ApiExceptionInterceptor
import surf.express.nord.proton.vpn.presentation.utils.interceptor.ModifyRequestInterceptor
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RemoteSourceModule {

    @Singleton
    @Provides
    fun provideApiService(retrofit: Retrofit): surf.express.nord.proton.vpn.data.remote.ApiService {
        return retrofit.create(surf.express.nord.proton.vpn.data.remote.ApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideGson() = GsonBuilder()
        .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
        .create()

    @Provides
    @Singleton
    fun provideHttpLoggingInterceptor(): HttpLoggingInterceptor {
        val logging = HttpLoggingInterceptor()
        val level = if (BuildConfig.DEBUG)
            HttpLoggingInterceptor.Level.BODY
        else
            HttpLoggingInterceptor.Level.NONE
        return logging.setLevel(level)
    }

    @Provides
    @Singleton
    fun provideRetrofit(
        @ApplicationContext context: Context, gson: Gson, logging: HttpLoggingInterceptor,
        apiExceptionInterceptor: ApiExceptionInterceptor,
        modifyRequestInterceptor: ModifyRequestInterceptor
    ): Retrofit {
        val okHttpClient =
            surf.express.nord.proton.vpn.presentation.utils.interceptor.UnsafeOkHttpClient.getUnsafeOkHttpClientBuilder()
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .connectTimeout(30, TimeUnit.SECONDS)
                .addInterceptor(modifyRequestInterceptor)
                .addInterceptor(logging)
                .addInterceptor(apiExceptionInterceptor)
                .build()

        return Retrofit.Builder()
            .baseUrl(context.getString(R.string.base_url))
            .addConverterFactory(GsonConverterFactory.create(gson))
            .client(okHttpClient)
            .build()
    }
}