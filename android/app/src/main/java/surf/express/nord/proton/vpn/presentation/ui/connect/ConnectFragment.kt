package surf.express.nord.proton.vpn.presentation.ui.connect

import android.animation.Animator
import android.animation.ValueAnimator
import android.content.Intent
import android.view.View
import android.view.animation.DecelerateInterpolator
import android.widget.FrameLayout
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.observe
import com.airbnb.lottie.LottieDrawable
import surf.express.nord.proton.vpn.R
import surf.express.nord.proton.vpn.databinding.FragmentConnectBinding
import surf.express.nord.proton.vpn.domain.model.Server
import surf.express.nord.proton.vpn.domain.model.Status
import surf.express.nord.proton.vpn.presentation.base.BaseFragment
import surf.express.nord.proton.vpn.presentation.ui.MainDelegate
import surf.express.nord.proton.vpn.presentation.ui.MainTabFragment
import surf.express.nord.proton.vpn.presentation.ui.MainTabUIDelegate
import surf.express.nord.proton.vpn.presentation.ui.ShareViewModel
import surf.express.nord.proton.vpn.presentation.utils.*
import surf.express.nord.proton.vpn.presentation.widget.bottomnav.BottomNavBar
import dagger.hilt.android.AndroidEntryPoint
import org.strongswan.android.logic.VpnStateService
import org.strongswan.android.ui.VpnProfileControlActivity
import org.strongswan.android.utils.Utils

@AndroidEntryPoint
class ConnectFragment : BaseFragment<FragmentConnectBinding>(R.layout.fragment_connect),
    MainTabFragment.OnTabChanged {

    private val shareViewModel: ShareViewModel by activityViewModels()

    private val viewModel: ConnectViewModel by viewModels()

    private var animator: ValueAnimator? = null

    private val delegate: MainDelegate? by lazy {
        return@lazy FragmentUtils.getParent(this, MainDelegate::class.java)
    }

    override fun initBinding(view: View): FragmentConnectBinding {
        return FragmentConnectBinding.bind(view)
    }

    override fun initView() {
        binding.btnServers.setOnClickListener {
            openServerList()
        }

        binding.btnConnect.setOnClickListener {
            val serverDraft = Server.getDraft()
            if (serverDraft == null) {
                openServerList()
                return@setOnClickListener
            }

            val intent = Intent(context, VpnProfileControlActivity::class.java)
            intent.action = VpnProfileControlActivity.START_PROFILE
            intent.putExtra(VpnProfileControlActivity.EXTRA_VPN_PROFILE_ID, serverDraft.uuid)
            startActivity(intent)
        }

        initChart()
    }

    override fun initObserve() {
        shareViewModel.serverLiveData.observe(viewLifecycleOwner) {
            if (it.status == Status.SUCCESS) {
                updateServerButton(value = it.data)
            }
        }

        viewModel.stateLiveData.observe(viewLifecycleOwner) { state ->
            when (state) {
                VpnStateService.State.CONNECTED -> {
                    binding.tvState.text = getString(R.string.disconnect)
                    binding.viewProgress.visibility = View.VISIBLE
                    animator?.cancel()
                    binding.viewProgress.layoutParams =
                        (binding.viewProgress.layoutParams as FrameLayout.LayoutParams).apply {
                            width = FrameLayout.LayoutParams.MATCH_PARENT
                        }

                    binding.lottieLogo.apply {
                        if (shareViewModel.isPremium) {
                            setAnimation(R.raw.connected)
                        } else {
                            setAnimation(R.raw.connected)
                        }
                        repeatCount = LottieDrawable.INFINITE
                        repeatMode = LottieDrawable.RESTART
                        playAnimation()
                    }
                }
                else -> {
                    if (state == VpnStateService.State.CONNECTING) {
                        delegate?.showInterstitialAd()
                        fakeProgress()
                    } else {
                        animator?.cancel()
                    }

                    binding.tvState.text = getString(R.string.connect)
                    binding.viewProgress.visibility = View.INVISIBLE

                    binding.lottieLogo.apply {
                        if (shareViewModel.isPremium) {
                            setAnimation(R.raw.disconnected)
                        } else {
                            setAnimation(R.raw.disconnected)
                        }

                        repeatCount = LottieDrawable.INFINITE
                        repeatMode = LottieDrawable.RESTART
                        playAnimation()
                    }

                    viewModel.syncDataIfNeed(shareViewModel.userLiveData.value)
                }
            }
        }

        viewModel.trafficLiveData.observe(viewLifecycleOwner) { (upStreamSpeed, downStreamSpeed) ->
            binding.traffic.tvUpload.text = Utils.parseTotal(upStreamSpeed)
            binding.traffic.tvDownload.text = Utils.parseTotal(downStreamSpeed)
        }
    }

    //region #Private method
    private fun initChart() {
        binding.traffic.chartUpload.init(intArrayOf(5, 30, 100, 65, 80))
        binding.traffic.chartDownload.init(intArrayOf(5, 30, 65, 50, 100))
    }

    private fun fakeProgress(startDelay: Long = 0L) {
        binding.viewProgress.visibility = View.VISIBLE
        val layoutParam: FrameLayout.LayoutParams =
            binding.viewProgress.layoutParams as FrameLayout.LayoutParams
        val originWidth = binding.viewProgress.width
        animator = ValueAnimator.ofFloat(0f, 100f)
            .apply {
                duration = 2000L
                interpolator = DecelerateInterpolator()
                setStartDelay(startDelay)
                addUpdateListener {
                    val value = it.animatedValue as Float
                    val process = originWidth.times(value) / 100
                    layoutParam.width = process.toInt()
                    binding.tvState.text = getString(R.string.connecting, "${value.toInt()}%")
                    binding.viewProgress.layoutParams = layoutParam
                    if (binding.viewProgress.visibility == View.INVISIBLE) {
                        binding.viewProgress.visibility = View.VISIBLE
                    }
                }

                addListener(object : Animator.AnimatorListener {
                    override fun onAnimationRepeat(p0: Animator?) {
                    }

                    override fun onAnimationEnd(p0: Animator?) {
                        if (viewModel.stateLiveData.value != VpnStateService.State.CONNECTED) {
                            binding.tvState.text = getString(R.string.waiting)
                        }
                    }

                    override fun onAnimationCancel(p0: Animator?) {
                    }

                    override fun onAnimationStart(p0: Animator?) {
                    }

                })
            }
        animator?.start()
    }

    private fun openServerList() {
        FragmentUtils.getParent(this, MainTabUIDelegate::class.java)
            ?.setCurrentTab(BottomNavBar.TAB_SERVERS)
    }

    private fun updateServerButton(value: Server? = null) {
        binding.btnServers.apply {
            setFlag(Util.getResId(value?.countryCode) ?: R.drawable.ic_globe)
            setTitle(value?.country ?: getString(R.string.select_the_fastest_server))
            setDescription(value?.state)
            value?.saveDraft()
        }
    }

    //endregion

    override fun onChange(tabIndex: Int) {
        if (tabIndex != BottomNavBar.TAB_HOME) {
            return
        }
        activity?.updateColorStatusBar(R.color.colorPrimary)
    }
}